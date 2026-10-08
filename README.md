# PHO VIETNAM — phovietnam.es

Bản Next.js của website phovietnam.es (trước đây là WordPress + Elementor, theme Patiotime), để deploy lên Vercel.

## Cách hoạt động

Giao diện giữ y nguyên vì dùng lại chính HTML, CSS và JS mà WordPress xuất ra:

- `scripts/import-wp.mjs` đọc HTML đã render của từng trang trên web gốc, bỏ những phần cần máy chủ WordPress (form bình luận, REST API, plugin rút gọn link, emoji…), rồi lưu vào `content/pages/*.json`. Script cũng chép đúng những file CSS/JS/ảnh/font mà các trang dùng từ source WordPress sang `public/wp-content/` và `public/wp-includes/`.
- `app/[[...slug]]/route.ts` trả về các tài liệu HTML đó. Toàn bộ trang được dựng tĩnh lúc build (SSG), Vercel phục vụ từ CDN.
- `scripts/fixes.mjs` sửa những phần còn sót từ bản demo của theme (link demo, bản đồ London, chữ "Patio.Time"…) và bật Google Consent Mode theo banner cookie. Các bản sửa được áp dụng mỗi lần import nên không bị mất.
- `scripts/seo.mjs` lo phần SEO và tốc độ: tiêu đề và mô tả có từ khóa "restaurante vietnamita en Barcelona", H1, alt cho ảnh, schema `Restaurant` cho 2 chi nhánh, hreflang, nạp sẵn ảnh hero và ảnh nền bài viết, dùng font lưu trên chính server thay vì Google Fonts, cho khung TheFork tải trễ.
- `scripts/en.mjs` tạo trang tiếng Anh `/en/` ("Vietnamese restaurant in Barcelona") từ trang chủ. Muốn sửa câu chữ tiếng Anh thì sửa bảng dịch trong file này.
- Ảnh JPEG/PNG được nén lại khi tiết kiệm được hơn 15% dung lượng; ảnh rộng hơn 2400px được thu nhỏ.
- PDF lớn hơn 10MB được nén lại bằng `scripts/compress-pdf.mjs` (thực đơn 311MB còn 6.8MB).
- `next.config.ts`: giữ URL có dấu `/` ở cuối như WordPress, chuyển hướng 301 các trang mẫu của theme và sitemap cũ của Yoast.
- `app/sitemap.ts` và `app/robots.ts` thay cho plugin Yoast.

## Chạy trên máy

```bash
npm install
npm run dev
```

## Cập nhật nội dung

Nội dung lấy từ web WordPress đang chạy và source code WordPress (mặc định ở `~/Downloads/cgi-bin`):

```bash
npm run import
```

Có thể chỉ định đường dẫn khác bằng `WP_DIR=/duong/dan/cgi-bin npm run import`. Thêm `--cached` để dùng lại HTML đã tải trong `.wp-cache/`. Muốn thêm hoặc bớt trang thì sửa danh sách `PAGES` trong `scripts/import-wp.mjs`.

## Deploy lên Vercel

1. Đẩy repo này lên GitHub.
2. Trên vercel.com, chọn **Add New → Project**, import repo, giữ nguyên cấu hình mặc định (Next.js) rồi bấm Deploy.
3. Kiểm tra bản `*.vercel.app`, sau đó vào **Settings → Domains**, thêm `phovietnam.es` và `www.phovietnam.es`, rồi sửa DNS ở nhà cung cấp tên miền theo hướng dẫn của Vercel.

Lưu ý: sau khi tên miền đã trỏ sang Vercel, lệnh `npm run import` không còn đọc được WordPress nữa. Khi cần, hãy chạy import trên một bản WordPress còn hoạt động (đặt `WP_ORIGIN`).
