using BackEnd.Settings;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;
namespace BackEnd.Services
{
    public class CloudinaryImageStorageService
    {
        private readonly Cloudinary _cloudinary;
        public CloudinaryImageStorageService(IOptions<CloudinarySettings> cloudinarySettings)
        {
            var account = new Account(
                cloudinarySettings.Value.CloudName,
                cloudinarySettings.Value.ApiKey,
                cloudinarySettings.Value.ApiSecret
                );
            _cloudinary = new Cloudinary( account );
        }

        public async Task<string> UploadImage(IFormFile file)
        {
            await using var strem=file.OpenReadStream();
            var uploadparam = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, strem),
                Folder = "todo-app/profile-pictures"
            };
            var result=await _cloudinary.UploadAsync(uploadparam);
            if (result.Error != null)
            {
                throw new Exception(result.Error.Message);
            }
            return result.SecureUrl.ToString();
        }
    }
}
