const { ObjectId } = require("mongodb");

class ContactService {
  constructor(client) {
    this.Contact = client.db().collection("contacts");
  }

  // Phương thức xử lý và lọc dữ liệu từ payload
  extractConactData(payload) {
    const contact = {
      name: payload.name,
      email: payload.email,
      address: payload.address,
      phone: payload.phone,
      favorite: payload.favorite,
    };

    // Loại bỏ các trường có giá trị undefined
    Object.keys(contact).forEach(
      (key) => contact[key] === undefined && delete contact[key]
    );
    return contact;
  }

  // Phương thức tạo contact mới hoặc cập nhật contact nếu đã tồn tại
  async create(payload) {
    try {
      const contact = this.extractConactData(payload);

      const result = await this.Contact.findOneAndUpdate(
        { email: contact.email },
        { $set: contact },
        { returnDocument: "after", upsert: true }
      );

      return result.value;
    } catch (error) {
      console.error("Error in create method:", error.message);
      throw new Error("Failed to create contact");
    }
  }

  // Phương thức tìm kiếm tất cả các contact theo bộ lọc
  async find(filter) {
    const cursor = await this.Contact.find(filter);
    return await cursor.toArray();
  }

  // Phương thức tìm kiếm contact theo tên (sử dụng regex)
  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" }, // Tìm kiếm không phân biệt hoa thường
    });
  }

  // Phương thức tìm kiếm contact theo ID
async findById(id) {
  if (!ObjectId.isValid(id)) {
    console.error("ID không hợp lệ:", id); // Log lỗi ID
    return null;
  }

  // Ép kiểu ID đúng
  const query = { _id: new ObjectId(id) };
  console.log("Truy vấn MongoDB:", query); // Log truy vấn MongoDB
  return await this.Contact.findOne(query);
}


  // Phương thức cập nhật thông tin contact theo ID
async update(id, payload) {
const filter = {
_id: ObjectId.isValid(id) ? new ObjectId(id) : null,
};
const update = this.extractConactData(payload);
const result = await this.Contact.findOneAndUpdate(
filter,
{ $set: update },
{ returnDocument: "after" }
);
return result.value; //return result;
}

async delete(id) {
  if (!ObjectId.isValid(id)) {
    console.error("ID không hợp lệ:", id);
    return null; 
  }

  const result = await this.Contact.findOneAndDelete({
    _id: new ObjectId(id), 
  });

  if (!result) {
    return null;
  }

  return result; 
}

async findFavorite() {
  return await this.find({ favorite: true });  
}

async deleteAll() {
const result = await this.Contact.deleteMany({});
return result.deletedCount;
}

}

module.exports = ContactService;