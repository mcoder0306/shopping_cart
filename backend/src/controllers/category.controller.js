import { categorAdd, categoryUpdate, categoryDelete, categoryGet } from "../services/category.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

const addCategory = async (req, res) => {
    try {
        const response = await categorAdd(req.body)
        if (response.status === 201) {
            return successResponse(res, response.status, response.message, response.category)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }

    } catch (error) {
        return errorResponse(res, 400, "error in creating category!!", error)
    }
}

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await categoryUpdate({ id: id, body: req.body })
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.category)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in update category", error)
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await categoryDelete(id)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.category)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in delete category", error)
    }
}

const getAllCategories = async (req, res) => {
    try {
        const response = await categoryGet(req.query)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.categories)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in get categories", error)
    }
}

export { addCategory, updateCategory, deleteCategory, getAllCategories }