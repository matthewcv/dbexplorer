using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dbexplorer.db.Model
{
    public class TableData
    {
        public int Count { get; set; }

        public List<List<object>> Rows { get; set; }
    }
}
