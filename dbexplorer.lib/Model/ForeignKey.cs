namespace dbexplorer.lib.Model
{
    public class ForeignKey
    {
        public string ConstraintName { get; set; }
        public string FromColumn { get; set; }
        public string ToTableSchema { get; set; }
        public string ToTableName { get; set; }
        public string ToTableColumn { get; set; }
    }
}