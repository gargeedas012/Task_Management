using BackEnd.Interfaces;
using BackEnd.Repositories;
using BackEnd.Services;
using BackEnd.Settings;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();


// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// MongoDB Settings
builder.Services.Configure<TodoDatabaseSettings>(
    builder.Configuration.GetSection("TodoDatabase"));


// Dependency Injection
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<ITodoService, TodoService>();


// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy
                .AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});


var app = builder.Build();



// Middleware

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


// ADD THIS LINE
app.UseCors("AllowReact");


app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();