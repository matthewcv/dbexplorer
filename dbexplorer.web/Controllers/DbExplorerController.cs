using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.ModelBinding;
using dbexplorer.db;
using dbexplorer.db.Model;

namespace dbexplorer.web.Controllers
{
    [RoutePrefix("Db")]
    public class DbExplorerController : ApiController
    {
        private readonly IDataAccess _data;
        private readonly IMetaData _meta;

        public DbExplorerController(IDataAccess data, IMetaData meta)
        {
            _data = data;
            _meta = meta;
        }

        /// <summary>
        /// Get a listing of all the tables in a database
        /// </summary>
        /// <returns></returns>
        [Route("Tables/{server}/{database}")]
        public async Task<List<Table>> GetTables(string server, string database)
        {
            return await _meta.GetTables(name(server), database);

        }

        /// <summary>
        /// get a listin of all the databases in a server
        /// </summary>
        /// <param name="server"></param>
        /// <returns></returns>
        [Route("Databases/{server}")]
        public async Task<List<Database>> GetDatabases(string server)
        {

            return await _meta.GetDatabases(name(server));
        }

        private string name(string n)
        {
            return n.Replace('-', '\\');
        }
    }
}
