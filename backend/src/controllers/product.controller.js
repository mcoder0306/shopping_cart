import { productCreate, productUpdate, productDelete, productsGet } from "../services/product.service.js";
import { errorResponse, successResponse } from "../utils/response.js";

const addProduct = async (req, res) => {
    try {
        const response = await productCreate({ info: req.body, image: req.file })
        if (response.status === 201) {
            return successResponse(res, response.status, response.message, response.product)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in creating product",error)
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await productUpdate({ body: req.body, file: req.file, id: id })
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.product)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in update product", error)
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await productDelete(id)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.deletedproduct)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in deleting product", error)

    }
}

const getProducts = async (req, res) => {
    try {
        //get products by id,category,price,id and all
        const response = await productsGet(req.query)
        if (response.status === 200) {
            return successResponse(res, response.status, response.message, response.products)
        }
        else {
            return errorResponse(res, response.status, response.message)
        }
    } catch (error) {
        return errorResponse(res, 400, "error in get products", error)
    }
}

export { addProduct, updateProduct, deleteProduct, getProducts }