using Microsoft.EntityFrameworkCore;
using mvc.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();

// CORS politikası tanımla
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// MySQL bağlantısını yapılandır
var connectionString = builder.Configuration.GetConnectionString("ConnectionStrings");

builder.Services.AddDbContext<EmployeeDbContex>(options =>
{
    options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 32)));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

// CORS middleware
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
