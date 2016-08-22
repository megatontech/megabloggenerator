﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using WebSite.Models;

namespace WebSite.Controllers
{
    public class PostController : Controller
    {
        #region - 方法 -

        // GET: Post/Create
        public ActionResult Create()
        {
            POST post = new POST();
            post.ExtScript = "";
            post.HasMusic = 0;
            post.IsPublish = 1;
            post.MusicList = "";
            post.Tag = "AutoGenerated";
            post.TitleImg = "";
            post.TitleImgDisp = "";
            post.Title = "test";
            post.TitleDisp = "test";
            post.CreateDate = DateTime.Now.ToShortDateString() + DateTime.Now.ToShortTimeString();
            post.LastEdit = "yuri";
            post.LastEditDate = DateTime.Now.ToShortDateString() + DateTime.Now.ToShortTimeString();
            post.DeleteFlag = 0;
            return View(post);
        }

        // POST: Post/Create
        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here
                using (var ctx = new WebSite.Models.MegaGenerateEntities())
                {
                    POST post = new POST();
                    post.ExtScript = "";
                    post.HasMusic = 0;
                    post.IsPublish = 1;
                    post.MusicList = "";
                    post.Tag = "AutoGenerated";
                    post.TitleImg = "";
                    post.TitleImgDisp = "";
                    post.Title = "test";
                    post.TitleDisp = "test";
                    post.CreateDate = DateTime.Now.ToShortDateString() + DateTime.Now.ToShortTimeString();
                    post.LastEdit = "yuri";
                    post.LastEditDate = DateTime.Now.ToShortDateString() + DateTime.Now.ToShortTimeString();
                    post.DeleteFlag = 0;
                    ctx.POST.Add(post);
                    ctx.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Post/Delete/5
        [HttpGet]
        public JsonResult Delete(int id)
        {
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                POST post = ctx.POST.Find(id);
                ctx.POST.Remove(post);
                ctx.SaveChanges();
            }
            return Json("ok",JsonRequestBehavior.AllowGet);
        }

        // POST: Post/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here
                using (var ctx = new WebSite.Models.MegaGenerateEntities())
                {
                    POST post = ctx.POST.Find(id);
                    ctx.POST.Remove(post);
                    ctx.SaveChanges();
                }
                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Post/Details/5
        public ActionResult Details(int id)
        {
            POST post = new POST();
            post.Id = id;
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                post = ctx.POST.Find(post.Id);
            }
            return View(post);
        }

        // GET: Post/Edit/5
        public ActionResult Edit(int id)
        {
            POST post = new POST();
            post.Id = id;
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                post = ctx.POST.Find(post.Id);
            }
            return View(post);
        }

        // POST: Post/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
                POST post = new POST();
                post.Id = id;
                using (var ctx = new WebSite.Models.MegaGenerateEntities())
                {
                    post = ctx.POST.Find(post.Id);
                    post.Content = null;
                    post.DeleteFlag = 0;
                    post.ExtScript = "";
                    post.HasMusic = 0;
                    post.IsPublish = 0;
                    post.LastEdit = "yuri";
                    post.LastEditDate = DateTime.Now.ToShortDateString() + DateTime.Now.ToShortTimeString();
                    post.MusicList = "";
                    post.Tag = "";
                    post.TitleImg = "";
                    post.TitleImgDisp = "";
                    post.Title = "";
                    post.TitleDisp = "";
                    ctx.Entry(post).State = System.Data.Entity.EntityState.Modified;
                    ctx.SaveChanges();
                }

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Post
        public ActionResult Index()
        {
            return RedirectToAction("List");
        }

        public ActionResult List()
        {
            var PostList = new List<POST>();
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                PostList = ctx.POST.ToList();
            }
            return View(PostList);
        }

        public ActionResult ListData()
        {
            var PostList = new List<POST>();
            using (var ctx = new WebSite.Models.MegaGenerateEntities())
            {
                PostList = ctx.POST.ToList();
            }
            PostList.ForEach(x=>x.TitleImgDisp=("<img style=' height: 30px;width: 40px;' src='../postImg/"+x.Id+"/"+x.TitleImgDisp+"' alt='title' />"));
            return Json(PostList,JsonRequestBehavior.AllowGet);
        }

        #endregion - 方法 -
    }
}