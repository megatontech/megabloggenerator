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
        // GET: Generate
        public ActionResult Index()
        {
            return View();
        }

        // GET: Generate/Details/5
        public ActionResult Details(int id)
        {
            PagePreview preview = new PagePreview();
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                preview.post = ctx.POST.Find(id);
                preview.templete = ctx.Templete.Find(preview.post.TempleteId);
            }
            return View(preview);
        }

        // GET: Generate/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Generate/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Generate/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Generate/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        [HttpGet]
        public JsonResult Generate(int id)
        {
            PagePreview preview = new PagePreview();
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                preview.post = ctx.POST.Find(id);
                preview.templete = ctx.Templete.Find(preview.post.TempleteId);
            }
            CommonHelper helper = new CommonHelper();
            string storagePath = Server.MapPath("/") + "\\blog\\"+DateTime.Now.Year+"\\"+DateTime.Now.Month+"\\";
            string fileName = preview.post.Title+".html";
            string pageName = "Details";
            var result = helper.GeneratePage(storagePath, fileName, pageName, preview,ControllerContext);
            return Json(result,JsonRequestBehavior.AllowGet);
        }

        // POST: Generate/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
