const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name cannot be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.error("Error in create controller:", error.message);
        return next(new ApiError(500, "An error occurred while creating the contact"));
    }
};


exports.findAll = async (req, res, next) => {
  let document = []; 
  try {
    const contactServiceInstance = new ContactService(MongoDB.client); 
    const { name } = req.query; 

    if (name) {
      document = await contactServiceInstance.findByName(name); 
    } else {
      document = await contactServiceInstance.find({}); 
    }
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while retrieving contacts")
    );
  }
  return res.send(document); 
};


exports.findOne = async (req, res, next) => {
  console.log("ID nhận được từ request:", req.params.id); // Log ID
  try {
    const contactService = new ContactService(MongoDB.client); // Đúng tên lớp
    const document = await contactService.findById(req.params.id);

    console.log("Document tìm thấy:", document); // Log kết quả
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send(document);
  } catch (error) {
    console.error("Lỗi:", error); // Log chi tiết lỗi
    return next(
      new ApiError(500, `Error retrieving contact with id = ${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length== 0){
    return next (new ApiError(400, "Data to update can not be empty"));
  }
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);
    if (!document){
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({message: "Contact was updates successfully"});
  } catch (error){
    return next(
      new ApiError(500, `Error updating contact with id =${req.params.id}`)
    );
  }

};

  exports.delete = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.delete(req.params.id);
    if (!document){
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send({message: "Contact was delete successfully"});
  } catch (error){
    return next(
      new ApiError(500, `Could not delete contact with id =${req.params.id}`
      )
    );
  }
};

// Delete all contacts of a user from the database
exports.deleteAll = async (_req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const deletedCount = await contactService.deleteAll();
    return res.send({
      message: `${deletedCount} contacts were deleted successfully`,
    });
  } catch (error) {
    return next(
      new ApiError(500, "An error occurred while removing all contacts")
    );
  }
};




exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findAllFavorite();
    return res.send(document);
  } catch (error){
    return next(
      new ApiError(
        500, "An error occurred while retrieving favorite contacts"
      )
    );
  }
};