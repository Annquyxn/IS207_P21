import { useState } from "react";

const jobData = {
  departments: [
    { name: "Tất cả", count: 1 },
    { name: "Hành Chính", count: 0 },
    { name: "Product Marketing", count: 0 },
    { name: "Tài chính kế toán", count: 0 },
    { name: "Phát triển phần mềm", count: 0 },
    { name: "Phòng kỹ thuật bảo hành", count: 0 },
    { name: "Kinh doanh Online", count: 1 },
    { name: "Showroom Hoàng Hoa Thám", count: 0 },
  ],
  locations: [
    "Tất cả",
    "HÀ NỘI - THÁI HÀ",
    "HỒ CHÍ MINH - HOÀNG HOA THÁM",
    "HỒ CHÍ MINH - KHA VẠN CÂN",
    "HỒ CHÍ MINH - TRẦN HƯNG ĐẠO",
    "HỒ CHÍ MINH - HOÀNG VĂN THỤ",
    "HỒ CHÍ MINH - AN DƯƠNG VƯƠNG",
  ],
  jobs: [
    {
      title: "Cộng tác viên Livestream",
      type: "Bán thời gian",
      location: "HỒ CHÍ MINH - HOÀNG HOA THÁM, 78-80-82 Hoàng Hoa Thám, Phường 12, Quận Tân Bình, HCM",
      salary: "Thương lượng",
      date: "07/05 — 06/06/2025",
    },
  ],
};

export default function JobPage() {
  const [searchDept, setSearchDept] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Lọc phòng ban theo từ khóa search
  const filteredDepartments = jobData.departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchDept.toLowerCase())
  );

  // Lọc địa điểm theo từ khóa search
  const filteredLocations = jobData.locations.filter((loc) =>
    loc.toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex gap-10">
      {/* Bên trái - Lọc */}
      <div className="flex flex-col w-72 gap-8">
        {/* Phòng ban */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase text-gray-800">Phòng Ban</h3>
          <input
            type="search"
            placeholder="Tìm nhanh phòng ban..."
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchDept}
            onChange={(e) => setSearchDept(e.target.value)}
          />
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {filteredDepartments.map((dept, i) => (
              <label key={i} className="inline-flex items-center gap-2 text-gray-700 cursor-pointer">
                <input type="checkbox" className="form-checkbox text-red-600" />
                <span>
                  {dept.name} <span className="text-red-500">({dept.count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Địa điểm */}
        <div>
          <h3 className="text-lg font-semibold mb-4 uppercase text-gray-800">Địa Điểm</h3>
          <input
            type="search"
            placeholder="Tìm nhanh địa điểm..."
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
          />
          <div className="flex flex-col gap-1 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {filteredLocations.map((loc, i) => (
              <label key={i} className="inline-flex items-center gap-2 text-gray-700 cursor-pointer">
                <input type="checkbox" className="form-checkbox text-red-600" />
                <span>{loc}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Bên phải - Danh sách việc làm */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-red-600 mb-6">CÁC CƠ HỘI VIỆC LÀM</h2>
        {jobData.jobs.map((job, i) => (
          <div key={i} className="mb-8 border-b border-gray-300 pb-6">
            <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
            <div className="flex items-center gap-4 mb-2 text-gray-600">
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {job.type}
              </span>

              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828 2.828l4.243 4.243a8 8 0 1111.314-11.314z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {job.location}
              </span>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="font-semibold flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2-1.343-2-3-2z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12v7" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19h6" />
                </svg>
                {job.salary}
              </span>
              <span className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2v-5H3v5a2 2 0 002 2z" />
                </svg>
                {job.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
