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
using dbexplorer.web.Models;

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
        [Route("DatabaseDetails/{server}/{database}")]
        public async Task<Database> GetDatabaseDetails(string server, string database)
        {
            return await _meta.GetDatabaseDetails(name(server), database);

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

        [Route("TableData/{server}/{database}/{table}")]
        [BindJson(typeof(TableQueryOptions),"options")]
        public async Task<List<List<object>>> GetTableData(string server, string database, string table, TableQueryOptions options)
        {
            return await _data.GetData(name(server), database, table, options);
        }

        private string name(string n)
        {
            return n.Replace('-', '\\');
        }
    }
}
