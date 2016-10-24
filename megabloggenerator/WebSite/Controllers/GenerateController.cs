using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebSite.Helper;
using WebSite.Models;

namespace WebSite.Controllers
{
    public class GenerateController : Controller
    {
        // GET: Generate/Details/5
        public ActionResult Details(int id)
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
        public ActionResult PageIndex() 
        {
            PageIndex pageindex = new PageIndex();
            List<POST> PostList = null;
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                PostList = ctx.POST.ToList();
            }
            pageindex.postList = PostList;
            return View(pageindex);
        }
        
        [HttpGet]
        public JsonResult UpdateIndex() 
        {
            PageIndex pageindex = new PageIndex();
            List<POST> PostList = null;
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                PostList = ctx.POST.ToList();
            }
            pageindex.postList = PostList;
            CommonHelper helper = new CommonHelper();
            string storagePath = Server.MapPath("/") + "\\blog\\";
            string fileName = "index.html";
            string pageName = "PageIndex";
            helper.GeneratePage(storagePath, fileName, pageName, pageindex, ControllerContext);
            return Json("(=ﾟωﾟ)=", JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult GenerateAll()
        {
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                List<POST> PostList = ctx.POST.ToList();
                foreach (POST post in PostList)
                {
                    PagePreview preview = new PagePreview();
                    preview.post = post;
                    preview.Content = System.Text.Encoding.Default.GetString(preview.post.Content);
                    preview.templete = ctx.Templete.Find(preview.post.TempleteId);
                    CommonHelper helper = new CommonHelper();
                    DateTime createDT = DateTime.Parse(preview.post.CreateDate);
                    string storagePath = Server.MapPath("/") + "\\blog\\" + createDT.Year + "\\" + createDT.Month + "\\";
                    string fileName = preview.post.Id + ".html";
                    string pageName = "Details";
                    helper.GeneratePage(storagePath, fileName, pageName, preview, ControllerContext);
                }
            }
            return Json("|∀ﾟ", JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult Generate(int id)
        {
            PagePreview preview = new PagePreview();
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                preview.post = ctx.POST.Find(id);
                preview.Content = System.Text.Encoding.Default.GetString(preview.post.Content);
                preview.templete = ctx.Templete.Find(preview.post.TempleteId);
            }
            CommonHelper helper = new CommonHelper();
            DateTime createDT = DateTime.Parse(preview.post.CreateDate);
            string storagePath = Server.MapPath("/") + "\\blog\\" + createDT.Year + "\\" + createDT.Month + "\\";
            string fileName = preview.post.Id + ".html";
            string pageName = "Details";
            helper.GeneratePage(storagePath, fileName, pageName, preview,ControllerContext);
            return Json("(＾o＾)ﾉ", JsonRequestBehavior.AllowGet);
        }

    }
}
