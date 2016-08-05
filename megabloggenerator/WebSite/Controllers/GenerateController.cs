using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
            return View();
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

        // GET: Generate/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
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
