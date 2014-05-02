using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
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
        public static async Task ExecuteReader(string server, string database, string query, Action<SqlDataReader> mapRow)
        {
            await ExecuteReader(server, database, c =>c.CommandText = query, mapRow);
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
        public static async Task ExecuteReader(string server,string database, Action<SqlCommand> prepareCommand,  Action<SqlDataReader> mapRow)
        {
            await ExecuteReaderAdvanced(server, database, prepareCommand, async r =>
            {
                while (await r.ReadAsync())
                {
                    mapRow(r);
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
        public static async Task ExecuteReaderAdvanced(string server, string database, string query, Action<SqlDataReader> useReader)
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
        public static async Task ExecuteReaderAdvanced(string server, string database, Action<SqlCommand> prepareCommand, Action<SqlDataReader> useReader)
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
                         useReader(reader);
                    }
                }
            }
            
        }

        public async Task<List<List<object>>> GetTableData(string server, string database, Table table, int page = 1, int size = 20)
        {
            return null;
            
        }
    }
}
