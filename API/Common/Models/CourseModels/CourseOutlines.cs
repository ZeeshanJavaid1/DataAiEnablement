using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.Models.CourseModels
{
    public class CourseOutlines
    {
        
        public int Id { get; set; }

        [Column("CourseId")]
        public int courseId { get; set; }

        [Column("OutlineText")]
        public string outlineText { get; set; }
    }
}
