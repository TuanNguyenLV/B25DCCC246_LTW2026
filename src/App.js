import { useState } from "react"
import StudentList from "./StudentList"

const App = () => {
    const [danhSach, setDanhSach] = useState([
        {
            id: 1371,
            name: "Nguyễn Văn An",
            score: 6.5,
            class: "01"
        },
        {
            id: 4843,
            name: "Trần Văn Bình",
            score: 6,
            class: "02"
        },
        {
            id: 2098,
            name: "Lê Văn Cường",
            score: 6,
            class: "03"
        }
    ])

    const [hoTen, setHoTen] = useState("")
    const [diem, setDiem] = useState("")
    const [lop, setLop] = useState("")
    const [boLoc, setBoLoc] = useState("all")
    const [loi, setLoi] = useState("")
    

    const handleThem = (event) => {
        event.preventDefault()

        if (hoTen.trim() === "" || diem === "" || lop.trim() === "") {
            setLoi("Vui lòng nhập đầy đủ thông tin")
            return
        }

        const diemSo = Number(diem)

        if (diemSo < 0 || diemSo > 10) {
            setLoi("Điểm số phải từ 0 đến 10")
            return
        }
       
        const sinhVienMoi = {
            id:Date.now().toString().slice(-4),
            name: hoTen,
            score: diemSo,
            class: lop
        }

        setDanhSach([...danhSach, sinhVienMoi])

        setHoTen("")
        setDiem("")
        setLop("")
        setLoi("")
    }

    const handleXoa = (id) => {
        setDanhSach(
            danhSach.filter((sinhVien) => sinhVien.id !== id)
        )
    }

    const danhSachLoc = danhSach.filter((sinhVien) => {
        if (boLoc === "good") {
            return sinhVien.score >= 8
        }

        if (boLoc === "fail") {
            return sinhVien.score < 5
        }

        return true
    })

    const tongDiem = danhSach.reduce(
        (tong, sinhVien) => tong + sinhVien.score,
        0
    )

    const diemTrungBinh = danhSach.length === 0
        ? 0
        : tongDiem / danhSach.length

    return (
        <div>
            <h1>Quản lý điểm sinh viên</h1>

            <form onSubmit={handleThem}>
                <div>
                    <label>Họ tên: </label>
                    <input
                        value={hoTen}
                        onChange={(event) => setHoTen(event.target.value)}
                    />
                </div>

                <div>
                    <label>Điểm số: </label>
                    <input
                        type="number"
                        value={diem}
                        onChange={(event) => setDiem(event.target.value)}
                    />
                </div>

                <div>
                    <label>Lớp: </label>
                    <input
                        value={lop}
                        onChange={(event) => setLop(event.target.value)}
                    />
                </div>

                <button type="submit">Thêm</button>
            </form>

            {loi && <p>{loi}</p>}

            <div>
                <button onClick={() => setBoLoc("all")}>
                    Tất cả
                </button>

                <button onClick={() => setBoLoc("good")}>
                    Giỏi
                </button>

                <button onClick={() => setBoLoc("fail")}>
                    Trượt
                </button>
            </div>
   

            <StudentList
                danhSach={danhSachLoc}
                onXoa={handleXoa}
            />

            <div>
                <p>
                    Tổng số sinh viên: {danhSach.length}
                </p>

                <p>
                    Điểm trung bình: {diemTrungBinh.toFixed(2)}
                </p>
            </div>
        </div>
    )
}

export default App