export default function removeDiacritics(str: string): string {
    return str
      .normalize("NFD")              // Tách các ký tự gốc và dấu
      .replace(/[\u0300-\u036f]/g, "") // Xoá các dấu đã tách
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }
  