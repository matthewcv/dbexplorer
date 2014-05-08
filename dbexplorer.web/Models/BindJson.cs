using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace dbexplorer.web.Models
{
    public class BindJson:ActionFilterAttribute
    {
        Type _type;
        string _queryStringKey;
        public BindJson(Type type, string queryStringKey)
        {
            _type = type;
            _queryStringKey = queryStringKey;
        }

        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            var json = actionContext.Request.RequestUri.ParseQueryString()[_queryStringKey];
           
            actionContext.ActionArguments[_queryStringKey] = Newtonsoft.Json.JsonConvert.DeserializeObject(json, _type);
        }

    }
}