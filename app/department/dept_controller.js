const deptservice=require('./dept_service');


const getAllDepartments=async(req,res)=>{
    try{
        const departments=await deptservice.getDepartments(req,res);
        res.status(200).json(departments);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}


const getDepartmentById=async(req,res)=>{
    try{
        const department=await deptservice.getDepartmentById(req,res);
        res.status(200).json(department);
    }catch(error){
        res.status(500).json({message:error.message});
    }
}



const createDepartment=async(req,res)=>{
    try{
        const department=await deptservice.createDepartment(req,res);
        res.status(201).json(department);
    }catch(error){
        res.status(400).json({message:error.message});
    }   
}

const updateDepartment=async(req,res)=>{
    try{
        const department=await deptservice.updateDepartment(req,res);
        res.status(200).json(department);
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

const deleteDepartment=async(req,res)=>{
    try{
        const department=await deptservice.deleteDepartment(req,res);
        res.status(200).json(department);
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

const UpdateEmployeeDepartment=async(req,res)=>{
    try{
        const result=await deptservice.UpdateEmployeeDepartment(req,res);
        res.status(200).json(result);
    }catch(error){
        res.status(400).json({message:error.message});
    }
}

module.exports={
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    UpdateEmployeeDepartment
}