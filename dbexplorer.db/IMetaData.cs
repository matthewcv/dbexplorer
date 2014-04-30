using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using dbexplorer.db.Model;

namespace dbexplorer.db
{
    public interface IMetaData
    {
        /// <summary>
        /// gets a listing of databases on a server
        /// </summary>
        /// <param name="server">the name of the server</param>
        /// <returns></returns>
        Task<List<Database>> GetDatabases(string server);

        /// <summary>
        /// gets a listing of tables from a database and serer
        /// </summary>
        /// <param name="server"></param>
        /// <param name="database"></param>
        /// <returns></returns>
        Task<List<Table>> GetTables(string server, string database);
    }
}
