import StudentItem from "./StudentItem"

const StudentList = ({ danhSach, onXoa }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>STT</th>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Điểm</th>
                    <th>Lớp</th>
                    <th>Thao tác</th>
                </tr>
            </thead>

            <tbody>
                {danhSach.map((sinhVien, index) => (
                    <StudentItem
                        key={sinhVien.id}
                        sinhVien={sinhVien}
                        stt={index + 1}
                        onXoa={onXoa}
                    />
                ))}
            </tbody>
        </table>
    )
}

export default StudentList