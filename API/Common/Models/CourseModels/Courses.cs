using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models.CourseModels
{
    public class Courses
    {
        public int Id { get; set; }

        [Column("Title")]
        public string title { get; set; }

        [Column("Subtitle")]
        public string subTitle { get; set; }

        [Column("Description")]
        public string courseDescription { get; set; }

        [Column("Duration")]
        public int duration { get; set; }

        [Column("DurationType")]
        public string durationType { get; set; }   // hours, days, weeks

        [Column("Level")]
        public string level { get; set; }         // beginner, intermediate, advanced

        [Column("Prerequisites")]
        public string? prerequisites { get; set; }

        [Column ("Audience")]
        public string? audience { get; set; }

        [Column("Price")]
        public string price { get; set; }         // can be "1500 $", "Negotiable", "Free"

        [Column("AudienceType")]
        public string audienceType { get; set; }

        [Column("Outcome")]
        public string? outcome { get; set; }

        [Column("ImageUrl")]
        [JsonIgnore]
        public string? imageUrl { get; set; }

        [Column("CreatedAt")]
        public DateTime createdAt { get; set; }
    }
}
