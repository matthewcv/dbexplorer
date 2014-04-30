using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dbexplorer.db.SqlServer
{
    public class DataAccess:IDataAccess
    {
        public static async Task ExecuteReader(string server, string database, string query, Action<SqlDataReader> action)
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
                    cmd.CommandText = query;
                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (reader.Read())
                        {
                            action(reader);
                        }
                    }
                }
            }
        }
    }
}
