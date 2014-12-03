using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using Microsoft.Ajax.Utilities;

namespace dbexplorer.web.Models
{
    public static class Extensions
    {
        public static string Database(this HttpActionContext context)
        {

            return context.Query("database");
        }
        public static string Server(this HttpActionContext context)
        {
            return context.Query("server");
        }

        public static string Query(this HttpActionContext context, string name)
        {
            Dictionary<string, string> dictionary = context.Request.GetQueryNameValuePairs().ToDictionary(kv => kv.Key, kv => kv.Value, StringComparer.OrdinalIgnoreCase);

            string val = null;

            dictionary.TryGetValue(name, out val);

            return val;
        }
    }
}