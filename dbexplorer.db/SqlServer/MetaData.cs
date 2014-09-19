using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Runtime.Remoting.Channels;
using System.Text;
using System.Threading.Tasks;
using dbexplorer.db.Model;

namespace dbexplorer.db.SqlServer
{
    public class MetaData:IMetaData
    {
        //private static List<Database> _databases = null;
        //private static List<Database> _databaseDetails = new List<Database>();

        private static string databaseDetailsSql = @"
--tables and columns
select t.TABLE_SCHEMA, t.TABLE_NAME, t.TABLE_TYPE, c.COLUMN_NAME, c.ORDINAL_POSITION, c.IS_NULLABLE, c.DATA_TYPE, c.CHARACTER_MAXIMUM_LENGTH from INFORMATION_SCHEMA.TABLES t
JOIN INFORMATION_SCHEMA.COLUMNS c ON c.TABLE_CATALOG = t.TABLE_CATALOG AND c.TABLE_SCHEMA = t.TABLE_SCHEMA AND c.TABLE_NAME = t.TABLE_NAME
ORDER BY t.TABLE_SCHEMA, t.TABLE_NAME,c.ORDINAL_POSITION

--primary keys
SELECT ccu.TABLE_SCHEMA, ccu.TABLE_NAME, ccu.COLUMN_NAME from 
INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc 
JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu ON ccu.CONSTRAINT_NAME = tc.CONSTRAINT_NAME
WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
ORDER BY ccu.TABLE_NAME, ccu.COLUMN_NAME


--foreign key relations
SELECT  KCU1.TABLE_SCHEMA AS 'FK_TABLE_SCHEMA', KCU1.TABLE_NAME AS 'FK_TABLE_NAME', KCU1.COLUMN_NAME AS 'FK_COLUMN_NAME', KCU1.ORDINAL_POSITION AS 'FK_ORDINAL_POSITION', KCU2.TABLE_SCHEMA AS 'PK_TABLE_SCHEMA', KCU2.TABLE_NAME AS 'PK_TABLE_NAME', KCU2.COLUMN_NAME AS 'PK_COLUMN_NAME'
   FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS RC
   JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU1 ON KCU1.CONSTRAINT_CATALOG = RC.CONSTRAINT_CATALOG AND KCU1.CONSTRAINT_SCHEMA = RC.CONSTRAINT_SCHEMA AND KCU1.CONSTRAINT_NAME = RC.CONSTRAINT_NAME
   JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU2 ON KCU2.CONSTRAINT_CATALOG = RC.UNIQUE_CONSTRAINT_CATALOG AND KCU2.CONSTRAINT_SCHEMA = RC.UNIQUE_CONSTRAINT_SCHEMA AND KCU2.CONSTRAINT_NAME = RC.UNIQUE_CONSTRAINT_NAME
   WHERE KCU1.ORDINAL_POSITION = KCU2.ORDINAL_POSITION
ORDER BY FK_TABLE_SCHEMA, FK_TABLE_NAME, FK_COLUMN_NAME, FK_ORDINAL_POSITION
";


        /// <summary>
        /// get a list of databases with just the basic information.  None of the specific details are given
        /// </summary>
        /// <param name="server"></param>
        /// <returns></returns>
        public async Task<List<Database>> GetDatabases(string server)
        {
            var    databases = new List<Database>();
                await DataAccess.ExecuteReader(server, "master", "select name from sys.databases WHERE name NOT IN ('master','tempdb','model','msdb')",
                    async r => databases.Add(new Database() { Name = r.GetString(0) }));

            return databases;

        }

        public async Task<Database> GetDatabaseDetails(string server, string database)
        {
            Database db = null;

            List<Table> tables = new List<Table>();
            await DataAccess.ExecuteReaderAdvanced(server, database, databaseDetailsSql,
                async r =>
                {
                    while ( await r.ReadAsync())
                    {
                        MapTablesAndColumns(tables,r);
                    }

                        await r.NextResultAsync();
                        while (await r.ReadAsync())
                    {
                        MapPrimaryKeys(tables, r);
                    }

                        await r.NextResultAsync();
                        while (await r.ReadAsync())
                    {
                        MapReferences(tables, r);
                    }
                });

            db.Tables = tables;

            
            return db;
        }

        private static void MapReferences(List<Table> tables, SqlDataReader reader)
        {
            string table = reader.GetString(1);
            string schema = reader.GetString(0);

            string pkSchema = reader.GetString(4);
            string pkTable = reader.GetString(5);

            Table ta = tables.FirstOrDefault(t => t.Name == table && t.Schema == schema);
            if (ta.References == null)
            {
                ta.References = new List<Reference>();
            }
            Reference re = ta.References.FirstOrDefault(r => r.PkTableName == pkTable && r.PkTableSchema == pkSchema);
            if (re == null)
            {
                re = new Reference()
                {
                    PkTableName = pkTable,
                    PkTableSchema = pkSchema,
                    FkColumns = new List<string>(),
                    PkColumns = new List<string>()
                };
                ta.References.Add(re);
            }

            re.FkColumns.Add(reader.GetString(2));
            re.PkColumns.Add(reader.GetString(6));
        }

        private static void MapPrimaryKeys(List<Table> tables, SqlDataReader reader)
        {
            string column = reader.GetString(2);
            string table = reader.GetString(1);
            string schema = reader.GetString(0);
            Table ta = tables.First(t => t.Name == table && t.Schema == schema);
            Column co = ta.Columns.First(c => c.Name == column);
            co.IsPrimaryKey = true;
        }

        private static void MapTablesAndColumns(List<Table> tables, SqlDataReader reader)
        {
            string name = reader.GetString(1);
            string schema = reader.GetString(0);
            var table = tables.FirstOrDefault(t => t.Name == name && t.Schema == schema);
            if (table == null)
            {
                table = new Table(){Name = name, Schema = schema, Type = reader.GetString(2), Columns = new List<Column>()};
                tables.Add(table);
            }

            Column c = new Column()
            {
                Name = reader.GetString(3),
                IsNullable = reader.GetString(5).Equals("YES", StringComparison.InvariantCultureIgnoreCase),
                DataType = reader.GetString(6)
            };

            SqlInt32 cml = reader.GetSqlInt32(7);
            
            if (!cml.IsNull)
            {
                c.DataType += "(" + cml.Value + ")";
            }
            table.Columns.Add(c);
        }


       
    }
}
