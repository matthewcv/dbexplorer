using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Newtonsoft.Json;

namespace dbexplorer.web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            JsonSerializerSettings jss = config.Formatters.JsonFormatter.SerializerSettings;
            jss.NullValueHandling = NullValueHandling.Ignore;
            

            // Web API routes
            config.MapHttpAttributeRoutes();



        }
    }
}
