using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSite.Models;

namespace WebSite.Controllers
{
    public class PreviewController : Controller
    {
        // GET: Generate/Details/5
        public ActionResult Details(int id = 1 )
        {
            PagePreview preview = new PagePreview();
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                preview.post = ctx.POST.Find(id);
                preview.Content = System.Text.Encoding.Default.GetString(preview.post.Content);
                preview.templete = ctx.Templete.Find(preview.post.TempleteId);
            }
            return View(preview);
        }
    }
}
