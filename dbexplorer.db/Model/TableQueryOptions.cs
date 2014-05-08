using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dbexplorer.db.Model
{
    public class TableQueryOptions
    {

        public static readonly TableQueryOptions Default = new TableQueryOptions(){ Page = 1, PageSize = 20};

        public int Page { get; set; }
        public int PageSize { get; set; }
    }
}
