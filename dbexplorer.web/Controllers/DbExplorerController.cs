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

        [Route("")]
        public async Task<Database> Get()
        {
            string database = ActionContext.Database();
            string server = ActionContext.Server();

            return await _meta.GetDatabaseDetails(server, database);

        }
    }
}
