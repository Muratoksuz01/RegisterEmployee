using Microsoft.EntityFrameworkCore;

namespace mvc.Models
{
    public class EmployeeDbContex:DbContext
    {
        public EmployeeDbContex(DbContextOptions<EmployeeDbContex> options):base(options){}
        public DbSet<EmployeeModel> Employees {get;set;}
    }
}