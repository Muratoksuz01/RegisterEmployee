using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mvc.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace mvc.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContex _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public EmployeeController(EmployeeDbContex context, IWebHostEnvironment hostEnvirement)
        {
            _context = context;
            this._hostEnvironment = hostEnvirement;
        }

        // GET: api/Employee
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeModel>>> GetEmployees()
        {
            return await _context.Employees.ToListAsync();
        }

        // GET: api/Employee/5
        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeModel>> GetEmployeeModel(int id)
        {
            var employeeModel = await _context.Employees.FindAsync(id);

            if (employeeModel == null)
            {
                return NotFound();
            }

            return employeeModel;
        }

        // POST: api/Employee
        [HttpPost]
        public async Task<ActionResult<EmployeeModel>> PostEmployeeModel([FromForm] EmployeeModel employeeModel)
        {
            System.Console.WriteLine("burada");
            employeeModel.ImageName = await SaveImage(employeeModel.ImageFile);
            _context.Employees.Add(employeeModel);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

        // PUT: api/Employee/5
        // PUT: api/Employee/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployeeModel(int id, [FromForm] EmployeeModel employeeModel)
        {
            if (id != employeeModel.EmployeeID)
            {
                return BadRequest();
            }

            var existingEmployee = await _context.Employees.FindAsync(id);
            if (existingEmployee == null)
            {
                return NotFound();
            }

            // Eğer yeni bir dosya gönderilmediyse, mevcut resim adını koruyun
            if (employeeModel.ImageFile == null)
            {
                employeeModel.ImageName = existingEmployee.ImageName;
            }
            else
            {
                // Yeni resim yüklenirse mevcut resmi sil
                if (!string.IsNullOrEmpty(existingEmployee.ImageName))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), "images", existingEmployee.ImageName);
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }
                // Yeni resmi kaydet
                employeeModel.ImageName = await SaveImage(employeeModel.ImageFile);
            }

            // Diğer alanları güncelle
            existingEmployee.EmployeeName = employeeModel.EmployeeName;
            existingEmployee.Occupation = employeeModel.Occupation;
            existingEmployee.ImageName = employeeModel.ImageName;

            _context.Entry(existingEmployee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeModelExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Employee/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployeeModel(int id)
        {
            var employeeModel = await _context.Employees.FindAsync(id);
            if (employeeModel == null)
            {
                return NotFound();
            }
            var deletedEmployee = employeeModel;
            _context.Employees.Remove(employeeModel);
            await _context.SaveChangesAsync();

            return Ok(deletedEmployee);
        }

        [HttpGet("GetEmployeeImage/{imageName}")]
        public IActionResult GetEmployeeImage(string imageName)
        {
            try
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "images", imageName);
                if (!System.IO.File.Exists(filePath))
                {
                    return NotFound();
                }

                // Resmi byte dizisi olarak oku
                var imageData = System.IO.File.ReadAllBytes(filePath);

                // Resmi MIME türüyle birlikte döndür
                return File(imageData, "image/jpeg");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private bool EmployeeModelExists(int id)
        {
            return _context.Employees.Any(e => e.EmployeeID == id);
        }
        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = Guid.NewGuid().ToString() + Path.GetExtension(imageFile.FileName);
            var imagePath = Path.Combine(Directory.GetCurrentDirectory(), "images", imageName);

            using (var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await imageFile.CopyToAsync(fileStream);
            }

            return imageName; // Benzersiz bir isim döndürülüyor
        }
    }
}
