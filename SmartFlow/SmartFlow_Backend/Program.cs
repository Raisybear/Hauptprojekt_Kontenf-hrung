using MongoDB.Driver;
using SmartFlow_Backend.Models;
using SmartFlow_Backend.Repositories;

namespace SmartFlow_Backend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddSingleton<UserRepository>();
            builder.Services.AddSingleton<KontoRepository>();

            builder.Services.AddSingleton<IUserRepository, UserRepository>();
            builder.Services.AddSingleton<IKontoRepository, KontoRepository>();
            builder.Services.AddSingleton<TransaktionsRepository>();

            builder.Services.AddSingleton<IMongoClient>(sp =>
            {
                var configuration = sp.GetRequiredService<IConfiguration>();
                return new MongoClient(configuration.GetSection("MongoDbConfig:ConnectionString").Value);
            });

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddControllers();

            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseCors("AllowAll");

            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
