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
                        "~/Scripts/angular.js"
                        ,"~/Scripts/app/*.js"
                        ));


            bundles.Add(new StyleBundle("~/Content/css").Include(
                    "~/Content/foundation.css",
                      "~/Content/site.css"));
        }
    }
}
