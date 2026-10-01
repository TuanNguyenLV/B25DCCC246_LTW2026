const StudentItem = ({ sinhVien, stt, onXoa }) => {
    const { id, name, score, class: lop } = sinhVien

    return (
        <tr>
            <td>{stt}</td>
            <td>{id}</td>
            <td>{name}</td>
            <td>{score}</td>
            <td>{lop}</td>
            <td>
                <button onClick={() => onXoa(id)}>
                    Xóa
                </button>
            </td>
        </tr>
    )
}

export default StudentItem