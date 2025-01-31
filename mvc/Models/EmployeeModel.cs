using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mvc.Models
{
    public class EmployeeModel()
    {
        [Key]
        public int EmployeeID { get; set; }
        [Column(TypeName ="nvarchar(50)")]
        public string? EmployeeName { get; set; }
        [Column(TypeName ="nvarchar(50)")]
        public string? Occupation { get; set; }
        [Column(TypeName ="nvarchar(100)")]
        public string? ImageName { get; set; }
        [NotMapped]
        public IFormFile? ImageFile { get; set; }
        
    }
}