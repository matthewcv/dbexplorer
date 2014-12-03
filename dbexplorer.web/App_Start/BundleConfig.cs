using System.Web;
using System.Web.Optimization;

namespace dbexplorer.web
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/scripts").Include(
                        "~/bower_components/angular/angular.js",
                        "~/bower_components/angular-ui-router/release/angular-ui-router.js"
                        
                        ).IncludeDirectory("~/client","*.js",true));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                    //"~/Content/foundation.css",
                      "~/Content/site.css"));
        }
    }
}
