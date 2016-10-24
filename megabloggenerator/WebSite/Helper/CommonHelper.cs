using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebSite.Helper
{
    public class CommonHelper
    {
        /// <summary>
        /// 生成静态文件
        /// </summary>
        /// <param name="storagePath">存储路径</param>
        /// <param name="fileName">存储文件名</param>
        /// <param name="pageName">页面名称</param>
        /// <param name="content">数据model</param>
        /// <param name="currentContext">当前controller</param>
        /// <returns></returns>
        public bool GeneratePage(string storagePath,string fileName,string pageName,object content,ControllerContext currentContext) 
        {
            bool success = false;
            if (!Directory.Exists(Path.GetDirectoryName(storagePath))) { Directory.CreateDirectory(Path.GetDirectoryName(storagePath)); }
            if (File.Exists(Path.GetDirectoryName(storagePath+fileName))) { File.Delete(Path.GetDirectoryName(storagePath + fileName)); }
            ViewEngineResult result = ViewEngines.Engines.FindView(currentContext, pageName, "");
            currentContext.Controller.ViewData.Model = content;
            //currentContext.Controller.TempData.Add("IsStatic",true);
            if (result.View != null) 
            {
                //生成
                using (StringWriter writer = new StringWriter()) 
                {
                    string resultHtmlStr = string.Empty;
                    ViewContext pageContext = new ViewContext(currentContext,result.View,currentContext.Controller.ViewData,currentContext.Controller.TempData,writer);
                    result.View.Render(pageContext,writer);
                    resultHtmlStr = writer.ToString();
                    File.WriteAllText(storagePath + fileName, resultHtmlStr);
                }
                success = true; 
            }
            else { success = false; }
            return success;
        }
    }
}