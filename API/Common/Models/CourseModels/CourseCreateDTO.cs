using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models.CourseModels
{
    public class CourseCreateDTO
    {
        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("subtitle")]
        public string Subtitle { get; set; }

        [JsonProperty("description")]
        public string Description { get; set; }

        [JsonProperty("duration")]
        public int Duration { get; set; }

        [JsonProperty("durationType")]
        public string DurationType { get; set; }

        [JsonProperty("level")]
        public string Level { get; set; }

        [JsonProperty("prerequisites")]
        public string? Prerequisites { get; set; }

        [JsonProperty("audience")]
        public string? Audience { get; set; }

        [JsonProperty("price")]
        public string Price { get; set; }         // can be "1500 $", "Negotiable", "Free"

        [JsonProperty("audienceType")]
        public string AudienceType { get; set; }

        [JsonProperty("outcome")]
        public string? Outcome { get; set; }

        [JsonProperty("outlines")]
        public List<string>? Outlines { get; set; }   // list of outline points

        [JsonProperty("image")]
        public IFormFile? Image { get; set; }
    }
}
