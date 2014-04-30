using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Channels;
using System.Text;
using System.Threading.Tasks;
using dbexplorer.db.Model;

namespace dbexplorer.db.SqlServer
{
    public class MetaData:IMetaData
    {

        public async Task<List<Database>> GetDatabases(string server)
        {
            List<Database> databases = new List<Database>();
            await DataAccess.ExecuteReader(server, "master", "select name from sys.databases WHERE name NOT IN ('master','tempdb','model','msdb')",
                r => databases.Add(new Database() { Name = r.GetString(0) }));
            return databases;

        }

        public async Task<List<Table>> GetTables(string server, string database)
        {
            List<Table> tables = new List<Table>();
            await DataAccess.ExecuteReader(server, database, "select TABLE_SCHEMA, TABLE_NAME, TABLE_TYPE from INFORMATION_SCHEMA.TABLES", 
                r => tables.Add(new Table(){Schema = r.GetString(0), Name = r.GetString(1), Type = r.GetString(1)}));
            return tables;
        }

        
    }
}
