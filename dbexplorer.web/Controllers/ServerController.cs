using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;
using dbexplorer.db;
using dbexplorer.db.Model;

namespace dbexplorer.web.Controllers
{
    [RoutePrefix("Server")]
    public class ServerController : ApiController
    {
        private readonly IMetaData _metaData;

        public ServerController(db.IMetaData metaData)
        {
            _metaData = metaData;
        }

        [Route("")]
        public async Task<Server> Get(string serverName)
        {
            //await Task.Delay(TimeSpan.FromSeconds(2));
            List<Database> databases = await _metaData.GetDatabases(serverName);

            //throw new Exception("ahhhh!");

            Server s = new Server();
            s.Name = serverName;
            s.Databases = databases;

            return s;

            
        }
    }
}
