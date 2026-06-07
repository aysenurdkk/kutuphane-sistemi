export const notFound = (req, res, next) => {
    res.status(404)
    next(new Error(`Bulunamadı: ${req.originalUrl}`))
}

export const hataYonetici = (err, req, res, next) => {
    res.status(res.statusCode === 200 ? 500 : res.statusCode).json({ mesaj: err.message })
}
