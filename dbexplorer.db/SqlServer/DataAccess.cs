using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;
using dbexplorer.db.Model;

namespace dbexplorer.db.SqlServer
{
    public class DataAccess:IDataAccess
    {
        /// <summary>
        /// execute a reader for the specific query and a callback that will be invoked for each row in the result
        /// </summary>
        /// <param name="server"></param>
        /// <param name="database"></param>
        /// <param name="query"></param>
        /// <param name="mapRow"></param>
        /// <returns></returns>
        public static async Task ExecuteReader(string server, string database, string query, Func<SqlDataReader, Task> mapRow)
        {
            await ExecuteReader(server, database, c =>c.CommandText = query,  mapRow);
        }

        /// <summary>
        /// execute the reader with a callback to prepare the command and a callback that will be invoked for each row in the result.  
        /// Useful for when you want to add parameters to the command or something
        /// </summary>
        /// <param name="server"></param>
        /// <param name="database"></param>
        /// <param name="prepareCommand"></param>
        /// <param name="mapRow"></param>
        /// <returns></returns>
        public static async Task ExecuteReader(string server,string database, Action<SqlCommand> prepareCommand,  Func<SqlDataReader,Task> mapRow)
        {
            await ExecuteReaderAdvanced(server, database, prepareCommand, async r =>
            {
                while (await r.ReadAsync())
                {
                    await mapRow(r);
                }
            });
        }

        /// <summary>
        /// execute the reader for a query and with a callback that will be invoked once with the reader.  It's up to the client to iterate through it.
        /// useful for when you have multiple results or when you want to do advanced stuff with the reader
        /// </summary>
        /// <param name="server"></param>
        /// <param name="database"></param>
        /// <param name="query"></param>
        /// <param name="useReader"></param>
        /// <returns></returns>
        public static async Task ExecuteReaderAdvanced(string server, string database, string query, Func<SqlDataReader, Task> useReader)
        {
            await ExecuteReaderAdvanced(server, database, c => c.CommandText = query, useReader);
        }

        /// <summary>
        /// execute the reader with a callback to prepare the command and with a callback that will be invoked once with the reader.  It's up to the client to iterate through it.
        /// Useful for when you want to add parameters to the command or something and when you have multiple results or when you want to do advanced stuff with the reader
        /// </summary>
        /// <param name="server"></param>
        /// <param name="database"></param>
        /// <param name="prepareCommand"></param>
        /// <param name="useReader"></param>
        /// <returns></returns>
        public static async Task ExecuteReaderAdvanced(string server, string database, Action<SqlCommand> prepareCommand, Func<SqlDataReader, Task> useReader)
        {
            SqlConnectionStringBuilder csb = new SqlConnectionStringBuilder();
            csb.IntegratedSecurity = true;
            csb.DataSource = server;
            csb.InitialCatalog = database;

            using (SqlConnection con = new SqlConnection(csb.ToString()))
            {
                await con.OpenAsync();
                using (SqlCommand cmd = con.CreateCommand())
                {
                    prepareCommand(cmd);
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                         await useReader(reader);
                    }
                }
            }
            
        }

        public async Task<TableData> GetData(string server, string database, string table, TableQueryOptions options = null)
        {
            options = options ?? TableQueryOptions.Default;

            Database db = await new MetaData().GetDatabaseDetails(server, database);

            Table tab = db.Tables.First(t => t.Name == table);

            string sql = GetSelectSql(tab, options);

            TableData data = new TableData();

            await ExecuteReader(server, database, GetCountSql(tab, options),  async r => data.Count = r.GetInt32(0));
            
            data.Rows = new List<List<object>>();

            await ExecuteReader(server, database, sql, async r =>
            {
                List<object> row = new List<object>();
                for (int i = 0; i < tab.Columns.Count; i++)
                {
                    row.Add(r[i]);
                }
                data.Rows.Add(row);
            });

            return data;
        }


        private string GetCountSql(Table t, TableQueryOptions options)
        {
            StringBuilder sb = new StringBuilder("SELECT COUNT(*) FROM ");
            sb.Append(t.Name);

            return sb.ToString();
        }

        private string GetSelectSql(Table t, TableQueryOptions options)
        {
            string columns = GetColumns(t, options);
            string sort = GetSortExpression(t, options);
            StringBuilder sb = new StringBuilder("SELECT * FROM ")
                .Append("(SELECT ")
                .Append(columns)
                .Append(", ROW_NUMBER() OVER (ORDER BY ")
                .Append(sort)
                .Append(") AS r ")
                .Append("FROM ")
                .Append(t.Name)
                .Append(") x WHERE ")
                .Append(GetPaging(options));




            return sb.ToString();
        }

        private string GetPaging(TableQueryOptions o)
        {
            int first = (o.Page - 1)*o.PageSize;
            int last = first + o.PageSize;

            return "x.r > " + first + " AND x.r <= " + last;
        }

        private string GetColumns(Table t, TableQueryOptions options)
        {
            StringBuilder sb = new StringBuilder();

            t.Columns.ForEach(c =>
            {
                if (sb.Length > 0)
                {
                    sb.Append(",");
                }
                sb.Append(c.Name);
            });


            return sb.ToString();
        }

        private string GetSortExpression(Table t, TableQueryOptions options)
        {
            StringBuilder sb = new StringBuilder();

            t.Columns.ForEach(c =>
            {
                if (c.IsPrimaryKey)
                {
                    if (sb.Length > 0)
                    {
                        sb.Append(",");
                    }
                    sb.Append(c.Name);
                }
            });


            return sb.ToString();
        }
    }
}
