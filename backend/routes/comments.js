const url = require("url");
const Comment = require("../server/models/Comment");

// Utility: parse JSON body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
}

async function commentsHandler(req, res, body) {
  // <-- add body here

  const parsedUrl = url.parse(req.url, true);
  const pathParts = parsedUrl.pathname.split("/").filter(Boolean);

  // -------- GET /api/comments/:restaurantId --------
  if (req.method === "GET" && pathParts[1] === "comments" && pathParts[2]) {
    const restaurantId = Number(pathParts[2]);

    if (isNaN(restaurantId)) {
      res.writeHead(400, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({ error: "restaurantId must be a number" }),
      );
    }

    try {
      const comments = await Comment.find({ restaurantId }).sort({ date: -1 });
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(comments));
    } catch (err) {
      console.error(err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to fetch comments" }));
    }
    return;
  }

  // -------- POST /api/comments --------
  if (req.method === "POST" && pathParts[1] === "comments") {
    try {
      console.log("➡ Received POST to /comments"); // <-- log
      console.log("➡ Body received:", body);

      const { restaurantId, text } = body;
      console.log("➡ Parsed restaurantId:", restaurantId, "text:", text);

      if (!restaurantId || isNaN(Number(restaurantId))) {
        console.error("❌ Invalid restaurantId:", restaurantId);
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(
          JSON.stringify({ error: "restaurantId must be a number" }),
        );
      }

      const comment = await Comment.create({
        restaurantId: Number(restaurantId),
        text,
      });

      console.log("✅ Comment created:", comment);

      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(comment));
    } catch (err) {
      console.error("❌ Error posting comment:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Failed to post comment" }));
    }
    return;
  }

  // -------- Default 404 --------
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found" }));
}

module.exports = commentsHandler;
