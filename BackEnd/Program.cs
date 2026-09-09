using BackEnd.Authentication;
using BackEnd.DTOs;
using BackEnd.Interfaces;
using BackEnd.Repositories;
using BackEnd.Services;
using BackEnd.Settings;
using BackEnd.Validators;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication;




var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();

//Fluent Validation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddScoped<IValidator<CreateTodoDto>, CreateTodoValidator>();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// MongoDB Settings
builder.Services.Configure<TodoDatabaseSettings>(
    builder.Configuration.GetSection("TodoDatabase"));
// Google Settings
builder.Services.Configure<GoogleSettings>(builder.Configuration.GetSection("Google"));


// Dependency Injection
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddHttpContextAccessor();


//add authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "CookieJwt";
    options.DefaultChallengeScheme = "CookieJwt";
})
.AddScheme<AuthenticationSchemeOptions, CookieJwtAuthenticationHandler>(
    "CookieJwt",
    options => { }
    );

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:5173", "https://task-management-gargee1.vercel.app")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        });
});
var app = builder.Build();
// Middleware

//if (app.Environment.IsDevelopment())
//{
    app.UseSwagger();
    app.UseSwaggerUI();
//}


app.UseCors("AllowReact");


//app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();