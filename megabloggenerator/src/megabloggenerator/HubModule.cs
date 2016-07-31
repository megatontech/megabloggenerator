// ****************************************************************************/
// CREATEDATE:  2016 - 07 - 31 - 12:11
// SOLUTION:      megabloggenerator
// PROJECT:         megabloggenerator
// FILENAME:       HubModule.cs
// CREATOR:        yuri
// Modify date:     
// Description:      
// ****************************************************************************/

using Nancy;

namespace megabloggenerator
{
    public sealed class HubModule : NancyModule
    {
        public HubModule()
        {
            Get("/", r => "Nancy running on ASP.NET Core ");
            Get("/{name}", r => "路由参数：" + r.name);
            Get("/404", r => HttpStatusCode.NotFound);
                Get("Generate",r=>r.name);

        }
    }
}