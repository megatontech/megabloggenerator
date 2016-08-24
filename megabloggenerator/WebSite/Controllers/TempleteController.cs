using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Mvc;
using WebSite.Models;

namespace WebSite.Controllers
{
    public class TempleteController : Controller
    {
        #region - 方法 -

        // GET: Templete/Create
        public ActionResult Create()
        {
            Templete templete = new Templete();
            return View();
        }

        // POST: Templete/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                Templete templete = new Templete();
                using (var ctx = new WebSite.Models.MegaGenerateEntities())
                {
                    templete.DispImg = collection["DispImg"];
                    templete.TempleteName = collection["TempleteName"];
                    templete.TempleteContent = Encoding.Unicode.GetBytes(collection["TempleteContent"]);
                    templete.CreateDate = DateTime.Now.ToShortDateString() + DateTime.Now.ToShortTimeString();
                    templete.UpdateDate = DateTime.Now.ToShortDateString() + DateTime.Now.ToShortTimeString();
                    ctx.Templete.Add(templete);
                    ctx.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Templete/Delete/5
        [HttpGet]
        public JsonResult Delete(int id)
        {
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                Templete templete = ctx.Templete.Find(id);
                ctx.Templete.Remove(templete);
                ctx.SaveChanges();
            }
            return Json("ok",JsonRequestBehavior.AllowGet);
        }

        // POST: Templete/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here
                using (var ctx = new WebSite.Models.MegaGenerateEntities())
                {
                    Templete templete = ctx.Templete.Find(id);
                    ctx.Templete.Remove(templete);
                    ctx.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Templete/Details/5
        public ActionResult Details(int id)
        {
            Templete templete = new Templete();
            templete.Id = id;
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                templete = ctx.Templete.Find(templete.Id);
            }
            return View(templete);
        }

        // GET: Templete/Edit/5
        public ActionResult Edit(int id)
        {
            Templete templete = new Templete();
            templete.Id = id;
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                templete = ctx.Templete.Find(templete.Id);
            }
            return View(templete);
        }

        // POST: Templete/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
                Templete templete = new Templete();
                templete.Id = id;
                using (var ctx = new WebSite.Models.MegaGenerateEntities())
                {
                    templete = ctx.Templete.Find(templete.Id);
                    templete.DispImg = collection["DispImg"];
                    templete.TempleteName = collection["TempleteName"];
                    templete.TempleteContent = Encoding.Unicode.GetBytes(collection["TempleteContent"]);
                    ctx.Entry(templete).State = System.Data.Entity.EntityState.Modified;
                    ctx.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Templete
        public ActionResult Index()
        {
            return RedirectToAction("List");
        }

        // GET: Templete
        public ActionResult List()
        {
            return View();
        }
        // GET: Templete
        public ActionResult ListData()
        {
            var TempleteList = new List<Templete>();
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                TempleteList = ctx.Templete.ToList();
            }
            return Json(TempleteList, JsonRequestBehavior.AllowGet);
        }
        #endregion
    }
}