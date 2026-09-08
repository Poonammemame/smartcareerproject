package org.techhub.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import org.techhub.model.Career;
import org.techhub.repository.CareerRepository;

@Service
public class CareerService {

    private final CareerRepository careerRepository;

    public CareerService(CareerRepository careerRepository) {
        this.careerRepository = careerRepository;
    }


    // ==========================================
    // SAVE
    // ==========================================

    public int saveCareer(Career career) {

        return careerRepository.save(career);
    }


    // ==========================================
    // GET ALL
    // ==========================================

    public List<Career> getAllCareers() {

        return careerRepository.findAll();
    }


    // ==========================================
    // GET BY ID
    // ==========================================

    public Optional<Career> getCareerById(Integer careerId) {

        return careerRepository.findById(careerId);
    }


    // ==========================================
    // SEARCH
    // ==========================================

    public List<Career> searchCareer(String careerName) {

        return careerRepository.searchByName(careerName);
    }


    // ==========================================
    // UPDATE
    // ==========================================

    public int updateCareer(Career career) {

        return careerRepository.update(career);
    }


    // ==========================================
    // DELETE
    // ==========================================

    public int deleteCareer(Integer careerId) {

        return careerRepository.deleteById(careerId);
    }


    // ==========================================
    // COUNT
    // ==========================================

    public int getTotalCareers() {

        return careerRepository.count();
    }
}