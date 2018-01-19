using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using dbexplorer.lib.Model;

namespace dbexplorer.lib
{
    public class SqlServerDatabaseInfo:IDatabaseInfo
    {
        private static string sql = @"
select t.TABLE_SCHEMA, t.TABLE_NAME, c.COLUMN_NAME, c.ORDINAL_POSITION, c.IS_NULLABLE, c.DATA_TYPE, c.CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.TABLES t 
join INFORMATION_SCHEMA.COLUMNS c on c.TABLE_CATALOG = t.TABLE_CATALOG and c.TABLE_SCHEMA = t.TABLE_SCHEMA and c.TABLE_NAME = t.TABLE_NAME
where t.TABLE_TYPE = 'BASE TABLE'
order by t.TABLE_SCHEMA, t.TABLE_NAME
";
        public async Task<Database> GetDatabase(string connection)
        {
            var db = new Database();
            using (SqlConnection con = new SqlConnection(connection))
            {
                await con.OpenAsync();
                using (SqlCommand cmd = new SqlCommand(sql, con))
                {
                    var reader = await cmd.ExecuteReaderAsync();
                    Table t = null;
                    while (await reader.ReadAsync())
                    {
                        
                        string schema = reader.GetString(0);
                        string name = reader.GetString(1);

                        if (t == null || t.Schema != schema || t.Name != name)
                        {
                            t = new Table()
                            {
                                Schema = schema,
                                Name =  name
                            };
                            db.Tables.Add(t);
                        }
                        t.Columns.Add(new Column()
                        {
                            Name = reader.GetString(2),
                            Ordinal = reader.GetInt32(3),
                            Nullable = reader.GetString(4).Equals("YES",StringComparison.InvariantCultureIgnoreCase),
                            DataType = reader.GetString(5) + (reader.IsDBNull(6)?"":$"({reader.GetInt32(6)})")
                        });
                        

                    }
                    
                }
            }

            return db;
        }
    }
}