using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Helper
{
    public class ImageHelper
    {
        public static string SaveImage(IFormFile file, string rootPath,
           string parentFolder = null, string subFolder = null)
        {
            // If rootPath null or empty, fallback to wwwroot (as before)...
            if (string.IsNullOrWhiteSpace(rootPath))
            {
                var basePath = Directory.GetCurrentDirectory();
                rootPath = Path.Combine(basePath, "wwwroot");
            }

            // If parentFolder provided, ensure it
            var workingRoot = rootPath;
            if (!string.IsNullOrWhiteSpace(parentFolder))
            {
                workingRoot = Path.Combine(rootPath, parentFolder);
                if (!Directory.Exists(workingRoot))
                    Directory.CreateDirectory(workingRoot);
            }

            // If subFolder provided, ensure it
            var targetFolder = workingRoot;
            if (!string.IsNullOrWhiteSpace(subFolder))
            {
                targetFolder = Path.Combine(workingRoot, subFolder);
                if (!Directory.Exists(targetFolder))
                    Directory.CreateDirectory(targetFolder);
            }

            // Save file
            var fileName = Path.GetFileName(file.FileName);
            var filePath = Path.Combine(targetFolder, fileName);
            using (var stream = new FileStream(filePath, FileMode.Create))
                file.CopyTo(stream);

            // Build relative path back to client: here we assume client serves from /Images/...
            // If parentFolder==null, we only drop subFolder under the Images root.
            var parts = new List<string>();
            if (!string.IsNullOrWhiteSpace(parentFolder)) parts.Add(parentFolder);
            if (!string.IsNullOrWhiteSpace(subFolder)) parts.Add(subFolder);
            parts.Add(fileName);
            var urlPath = "/" + string.Join("/", parts);

            return urlPath;
        }
    }
}
