class ErrExtender extends Error {
    errstatus
    errmsg
    specific_stack
    constructor (errmsg, errstatus, specific_stack) {
        super(errmsg)
        this.errstatus = errstatus || 500
        this.specific_stack = specific_stack || 'Not mentioned'
        Object.setPrototypeOf(this, ErrExtender.prototype)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }    
}

export function thisError (errmsg, errstatus, specific_stack) {
    throw new ErrExtender(errmsg, errstatus, specific_stack)
}

export function ErrorMiddleware(err, req, res, next) {
  const { message, errstatus, specific_stack } = err;

  res.status(errstatus).json({
    success: false,
    message,
    specific_stack,
    errorStatus: errstatus,
  });
}